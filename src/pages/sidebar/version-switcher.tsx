import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import Logo from '@/assets/logo/logo1.svg';
export function VersionSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 p-2 rounded-lg">
          <img src={Logo} alt="Logo" className="h-10  object-contain" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
