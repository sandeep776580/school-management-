
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  contact: yup
    .string()
    .matches(/^\+?[0-9\-\s]{7,15}$/, 'Enter a valid contact number')
    .required('Contact is required'),
  email_id: yup.string().email('Invalid email').required('Email is required'),
  image: yup
    .mixed()
    .test('required', 'Image is required', (value) => {
      return value && value.length > 0;
    })
});

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setMessage(null);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image') {
          if (value && value.length > 0) {
            formData.append('image', value[0]);
          }
        } else {
          formData.append(key, value);
        }
      });
      const res = await fetch('/api/schools', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save school');
      setMessage('School saved successfully!');
      reset();
      setPreview(null);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <main className="container py-10">
      <div className="max-w-3xl mx-auto card">
        <h1 className="text-2xl font-bold mb-6">Add School</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div>
            <label className="label">Name</label>
            <input className="input" placeholder="School Name" {...register('name')} />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input" placeholder="Street address" {...register('address')} />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input className="input" placeholder="City" {...register('city')} />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label">State</label>
              <input className="input" placeholder="State" {...register('state')} />
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Contact</label>
              <input className="input" placeholder="+91 9876543210" {...register('contact')} />
              {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" placeholder="info@school.com" {...register('email_id')} />
              {errors.email_id && <p className="text-red-600 text-sm mt-1">{errors.email_id.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Image</label>
            <input type="file" accept="image/*" className="input" {...register('image')} onChange={handleImageChange} />
            {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>}
            {preview && (
              <div className="mt-3">
                <p className="text-sm mb-2">Preview:</p>
                <img src={preview} alt="preview" className="rounded-lg max-h-64 object-cover" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save School'}
            </button>
          </div>
          {message && <p className="text-sm mt-2">{message}</p>}
        </form>
      </div>
    </main>
  );
}
