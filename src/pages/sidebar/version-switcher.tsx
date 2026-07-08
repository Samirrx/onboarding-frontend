import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
export function VersionSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 p-2 rounded-lg">
          <img
            src="https://opsbeats.s3.ap-south-1.amazonaws.com/logo/dglide_logo.svg"
            alt="Logo"
            className="h-10  object-contain"
          />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
