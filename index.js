
import fs from 'fs';
import path from 'path';
import { getPool } from '@/lib/db';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }
};

function getFieldVal(field) {
  if (Array.isArray(field)) return field[0];
  return field;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const form = formidable({
        multiples: false,
        keepExtensions: true
      });

      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      const name = getFieldVal(fields.name);
      const address = getFieldVal(fields.address);
      const city = getFieldVal(fields.city);
      const state = getFieldVal(fields.state);
      const contact = getFieldVal(fields.contact);
      const email_id = getFieldVal(fields.email_id);

      let storedFileName = null;
      const img = files.image;
      if (img && !Array.isArray(img)) {
        const origName = img.originalFilename || 'image';
        const safe = origName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const unique = Date.now() + '_' + safe.toLowerCase();
        const dest = path.join(uploadDir, unique);
        await fs.promises.copyFile(img.filepath, dest);
        storedFileName = unique;
      }

      const pool = await getPool();
      const [result] = await pool.execute(
        `INSERT INTO schools (name, address, city, state, contact, image, email_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, address, city, state, contact, storedFileName, email_id]
      );

      res.status(201).json({ id: result.insertId, message: 'Saved' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error while saving school' });
    }
    return;
  }

  if (req.method === 'GET') {
    try {
      const pool = await getPool();
      const [rows] = await pool.query(
        'SELECT id, name, address, city, image FROM schools ORDER BY id DESC'
      );
      res.status(200).json({ schools: rows });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
