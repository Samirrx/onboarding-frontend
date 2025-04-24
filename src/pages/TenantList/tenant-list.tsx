'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Database,
  ExternalLink,
  Server,
  Shield,
  User
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchTenantList } from '@/services/controllers/onboarding';
import { useNavigate } from 'react-router-dom';

interface Tenant {
  id: number;
  name: string;
  tenantId: string;
  dbUsername: string;
  dbPassword: string;
  dbUri: string;
  dbName: string;
  bucketName: string;
  cloudfrontUrl: string;
  onboardingDate: string;
  createdBy: string | null;
  createdOn: string;
  updatedBy: string | null;
  updatedOn: string | null;
  active: boolean;
}

export default function TenantDashboard() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const navigate = useNavigate();

  const fetchTenantsLists = async () => {
    try {
      const response = await fetchTenantList();
      console.log('Tenants List Response:', response);
      setTenants(response);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };
  useEffect(() => {
    fetchTenantsLists();
  }, []);

  const handleShowMore = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const filteredTenants = tenants.filter((tenant) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      tenant.name.toLowerCase().includes(searchLower) ||
      tenant.tenantId.toLowerCase().includes(searchLower) ||
      tenant.dbName.toLowerCase().includes(searchLower) ||
      tenant.bucketName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold tracking-tight">
            Tenant Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all tenant configurations in the system
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-800 dark:border-slate-700"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <Button
            className="gap-2"
            onClick={() => navigate('/onboarding-flow')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Onboard
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 grid grid-cols-12 gap-4 font-medium text-sm border-b">
          <div className="col-span-3">Tenant</div>
          <div className="col-span-2">Database</div>
          <div className="col-span-2">Storage</div>
          <div className="col-span-3">CDN</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredTenants.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No tenants found matching your search criteria.
          </div>
        )}

        {filteredTenants.map((tenant) => (
          <div
            key={tenant.id}
            className="p-4 grid grid-cols-12 gap-4 items-center border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
          >
            <div className="col-span-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tenant.name}</span>
                  {tenant.active ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  ID: {tenant.tenantId}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(tenant.onboardingDate)}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="flex flex-col">
                <div className="text-sm truncate">{tenant.dbName}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {tenant.dbUsername}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-sm truncate">{tenant.bucketName}</div>
            </div>

            <div className="col-span-3">
              <div className="text-sm truncate">{tenant.cloudfrontUrl}</div>
            </div>

            <div className="col-span-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShowMore(tenant)}
                className="gap-1"
              >
                Details
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTenant && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {selectedTenant.name}
                {selectedTenant.active && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    Active
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Complete configuration details for tenant ID:{' '}
                {selectedTenant.tenantId}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-slate-500" />
                    Tenant Information
                  </h3>
                  <dl className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                    <dt className="text-muted-foreground">ID:</dt>
                    <dd>{selectedTenant.id}</dd>
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd>{selectedTenant.name}</dd>
                    <dt className="text-muted-foreground">Tenant ID:</dt>
                    <dd>{selectedTenant.tenantId}</dd>
                    <dt className="text-muted-foreground">Status:</dt>
                    <dd>{selectedTenant.active ? 'Active' : 'Inactive'}</dd>
                  </dl>
                </div>

                <div>
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Dates
                  </h3>
                  <dl className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                    <dt className="text-muted-foreground">Onboarded:</dt>
                    <dd>{formatDate(selectedTenant.onboardingDate)}</dd>
                    <dt className="text-muted-foreground">Created:</dt>
                    <dd>{formatDate(selectedTenant.createdOn)}</dd>
                    <dt className="text-muted-foreground">Created By:</dt>
                    <dd>{selectedTenant.createdBy || 'System'}</dd>
                    <dt className="text-muted-foreground">Updated:</dt>
                    <dd>
                      {selectedTenant.updatedOn
                        ? formatDate(selectedTenant.updatedOn)
                        : 'Never'}
                    </dd>
                  </dl>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Database className="h-4 w-4 text-slate-500" />
                  Database Configuration
                </h3>
                <dl className="grid md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  <div className="space-y-2">
                    <div>
                      <dt className="text-muted-foreground">Database Name:</dt>
                      <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1">
                        {selectedTenant.dbName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Username:</dt>
                      <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1">
                        {selectedTenant.dbUsername}
                      </dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Connection URI:</dt>
                    <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1 break-all">
                      {selectedTenant.dbUri}
                    </dd>
                  </div>
                </dl>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Server className="h-4 w-4 text-slate-500" />
                  Storage Configuration
                </h3>
                <dl className="grid md:grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Bucket Name:</dt>
                    <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1">
                      {selectedTenant.bucketName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">CDN URL:</dt>
                    <dd className="font-mono text-xs bg-slate-100 dark:bg-slate-800 p-1.5 rounded mt-1 break-all">
                      {selectedTenant.cloudfrontUrl}
                    </dd>
                  </div>
                </dl>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Sensitive information is masked for security
                </div>
                <Button variant="default">Edit Tenant</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
