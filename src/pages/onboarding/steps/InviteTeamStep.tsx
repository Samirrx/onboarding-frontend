import { useState } from 'react';

import { ArrowLeft, ArrowRight, Plus, Trash2, Mail } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  email: string;
  role: string;
}

interface InviteTeamStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function InviteTeamStep({
  formData,
  updateFormData,
  onNext,
  onBack
}: InviteTeamStepProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    formData.teamMembers || []
  );
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddMember = () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (teamMembers.some((member) => member.email === email)) {
      setError('This email has already been added');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      email,
      role
    };

    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    updateFormData({ teamMembers: email });

    // Reset form
    setEmail('');
    setRole('admin');
    setError('');
  };

  const handleRemoveMember = (id: string) => {
    const updatedMembers = teamMembers.filter((member) => member.id !== id);
    setTeamMembers(updatedMembers);
    updateFormData({ teamMembers: updatedMembers });
  };

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-justify">
          Invite Your Team
        </h2>
        <p className="text-muted-foreground text-justify">
          Add team member to collaborate with you.
        </p>
      </div>

      <div className="grid gap-6 pt-4">
        <div className="space-y-4">
          <div className="flex gap-4 sm:grid-cols-[1fr,auto,auto]">
            <div className="space-y-2 w-full">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={teamMembers.length >= 1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={teamMembers.length >= 1}
              >
                <SelectTrigger id="role" className="w-[140px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAddMember}
                className="mb-0.5"
                disabled={teamMembers.length >= 1}
              >
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">
            Team Members ({teamMembers.length})
          </h3>

          {teamMembers.length === 0 ? (
            <div className="border rounded-md p-8 text-center">
              <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No team members added yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add team members to collaborate with you
              </p>
            </div>
          ) : (
            <div className="border rounded-md divide-y">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {member.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-sm font-medium">{member.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleSubmit} disabled={teamMembers.length === 0}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
