import { useState, type SubmitEvent } from 'react';
import { z } from 'zod';
import { useLibrary } from '../context/LibraryContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CameraCapture } from '../components/ui/CameraCapture';
import { formatDate } from '../utils/helpers';

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().min(1, 'Phone is required'),
  idNumber: z.string().min(1, 'ID number is required'),
});

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  idNumber: '',
};

export function Members() {
  const { members, loading, addMember } = useLibrary();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const filteredMembers = members.filter(
    (m) =>
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openModal = () => {
    setFormData(emptyForm);
    setIdPhoto(null);
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = memberSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    const success = await addMember({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      idNumber: parsed.data.idNumber,
      idPhoto,
    });
    setSubmitting(false);
    if (success) {
      setFormData(emptyForm);
      setIdPhoto(null);
      setIsModalOpen(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading members..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <Button onClick={openModal}>+ Add Member</Button>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {filteredMembers.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No members found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  ID Number
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {member.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {member.phone}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {member.idNumber}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(member.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Member"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.currentTarget.value)}
            error={fieldErrors.name}
            placeholder="e.g. Juan Dela Cruz"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.currentTarget.value)}
            error={fieldErrors.email}
            placeholder="e.g. juan@email.com"
          />
          <Input
            id="phone"
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.currentTarget.value)}
            error={fieldErrors.phone}
            placeholder="e.g. 09171234567"
          />
          <Input
            id="idNumber"
            label="ID Number"
            value={formData.idNumber}
            onChange={(e) => handleChange('idNumber', e.currentTarget.value)}
            error={fieldErrors.idNumber}
            placeholder="e.g. DL-1234-5678 or SSS-12-345678"
          />

          {/* Camera Capture for ID photo */}
          <CameraCapture
            onCapture={(dataUrl) => setIdPhoto(dataUrl)}
            capturedImage={idPhoto}
            onClear={() => setIdPhoto(null)}
          />

          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={submitting}>
              Add Member
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
