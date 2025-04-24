'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Database,
  ExternalLink,
  Globe,
  Server,
  Shield,
  User
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { notify } from '@/hooks/toastUtils';
import { fetchTenantList } from '@/services/controllers/onboarding';

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

export default function TenantList() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // const tenants: Tenant[] = [
  //   {
  //     id: 1,
  //     name: "Crm",
  //     tenantId: "crm",
  //     dbUsername: "dglide_crm",
  //     dbPassword: "Notfun10#",
  //     dbUri: "jdbc:mysql://3.6.229.13:3306/dglide_crm?serverTimezone=UTC",
  //     dbName: "dglide_crm",
  //     bucketName: "dglide-crm",
  //     cloudfrontUrl: "https://d15w2pb1fyg4an.cloudfront.net/",
  //     onboardingDate: "2024-12-27T11:16:39.000+00:00",
  //     createdBy: null,
  //     createdOn: "2024-12-27T11:22:25.000+00:00",
  //     updatedBy: null,
  //     updatedOn: null,
  //     active: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Itsm",
  //     tenantId: "itsm",
  //     dbUsername: "dglide_itsm",
  //     dbPassword: "Notfun10#",
  //     dbUri: "jdbc:mysql://3.6.229.13:3306/dglide_itsm?serverTimezone=UTC",
  //     dbName: "dglide_itsm",
  //     bucketName: "dglide-itsm",
  //     cloudfrontUrl: "https://dkiafj4r7hhwn.cloudfront.net/",
  //     onboardingDate: "2025-01-06T12:12:39.000+00:00",
  //     createdBy: null,
  //     createdOn: "2025-01-06T12:18:59.000+00:00",
  //     updatedBy: null,
  //     updatedOn: null,
  //     active: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Helpdesk",
  //     tenantId: "helpdesk",
  //     dbUsername: "uat",
  //     dbPassword: "Notfun10#",
  //     dbUri: "jdbc:mysql://3.6.229.13:3306/dglide_helpdesk?serverTimezone=UTC",
  //     dbName: "dglide_helpdesk",
  //     bucketName: "dglide-helpdesk",
  //     cloudfrontUrl: "https://d21b3ecwe3go40.cloudfront.net/",
  //     onboardingDate: "2025-01-23T15:12:39.000+00:00",
  //     createdBy: null,
  //     createdOn: "2025-01-23T15:12:39.000+00:00",
  //     updatedBy: null,
  //     updatedOn: null,
  //     active: true,
  //   },
  //   {
  //     id: 4,
  //     name: "Panindia",
  //     tenantId: "panindia",
  //     dbUsername: "dglide_panindia",
  //     dbPassword: "Notfun10#",
  //     dbUri: "jdbc:mysql://3.6.229.13:3306/dglide_panindia?serverTimezone=UTC",
  //     dbName: "dglide_panindia",
  //     bucketName: "dglide-panindia",
  //     cloudfrontUrl: "https://d3krmg3kkoam8o.cloudfront.net/",
  //     onboardingDate: "2025-02-11T06:58:55.000+00:00",
  //     createdBy: null,
  //     createdOn: "2025-02-11T07:05:07.000+00:00",
  //     updatedBy: null,
  //     updatedOn: null,
  //     active: true,
  //   },
  //   {
  //     id: 5,
  //     name: "DGLIDE",
  //     tenantId: "dglide",
  //     dbUsername: "dglide_admin",
  //     dbPassword: "Notfun10#",
  //     dbUri: "jdbc:mysql://3.6.229.13:3306/dglide_admin?serverTimezone=UTC",
  //     dbName: "dglide_admin",
  //     bucketName: "dglide-admin",
  //     cloudfrontUrl: "https://d2bz85kuo0j2o3.cloudfront.net/",
  //     onboardingDate: "2025-02-11T07:05:07.000+00:00",
  //     createdBy: null,
  //     createdOn: "2025-02-11T07:05:07.000+00:00",
  //     updatedBy: null,
  //     updatedOn: null,
  //     active: true,
  //   },
  // ]
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all tenant configurations in the system
        </p>
      </div>
      <div className="h-[calc(100vh-200px)] overflow-auto">
        <div className="grid gap-6">
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className="w-full overflow-hidden transition-all hover:shadow-md py-0 gap-0"
            >
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-2">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {tenant.name}
                      {tenant.active && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                        >
                          Active
                        </Badge>
                      )}
                      {!tenant.active && (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                        >
                          Inactive
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Tenant ID: {tenant.tenantId}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Onboarded: {formatDate(tenant.onboardingDate)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Database className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div className="flex flex-col items-start">
                      <h3 className="font-medium text-sm">Database</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tenant.dbName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Server className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div className="flex flex-col items-start">
                      <h3 className="font-medium text-sm">Storage</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tenant.bucketName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div className="flex flex-col items-start">
                      <h3 className="font-medium text-sm">CDN</h3>
                      <p className="text-sm text-muted-foreground mt-1 truncate max-w-[200px]">
                        {tenant.cloudfrontUrl}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Created: {formatDate(tenant.createdOn)}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleShowMore(tenant)}
                  className="gap-2"
                >
                  Show More Details
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTenant && (
          <DialogContent className="max-w-5xl w-5xl h-[calc(100vh-50px)] overflow-auto sm:max-w-5xl">
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
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
