'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Save, UserCircle, MapPin, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    region: '',
    bio: '',
  });

  useEffect(() => {
    api.get('/users/me').then(({ data }) => {
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        region: data.region || '',
        bio: data.bio || '',
      });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/users/me', formData);
      alert('Profile updated successfully');
    } catch {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 fade-in max-w-2xl">
      <div>
        <h1 className="font-syne text-3xl font-bold text-foreground">Profile Details</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-6 mb-8 items-center">
             <div className="w-20 h-20 rounded-full bg-background border border-border flex items-center justify-center">
                <UserCircle size={40} className="text-muted-foreground" />
             </div>
             <div>
               <div className="font-medium">{profile?.email}</div>
               <div className="text-sm text-muted-foreground">Role: {profile?.role}</div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">First Name</label>
              <input 
                type="text" 
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
                placeholder="John"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Last Name</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
                placeholder="Doe"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all"
              />
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                 <MapPin size={16} /> Location / Region
              </label>
              <input 
                type="text" 
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value})}
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all"
              />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
               <Briefcase size={16} /> Bio
            </label>
            <textarea 
               value={formData.bio}
               onChange={e => setFormData({...formData, bio: e.target.value})}
               placeholder="Write a little about yourself..."
               rows={4}
               className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)_/_0.1)] transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
             <button
                type="submit"
                disabled={saving}
                className="bg-primary text-black hover:bg-primary/90 disabled:opacity-50 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
             >
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
