import { X, Minus } from "@phosphor-icons/react";
import { Window } from '@tauri-apps/api/window';
import { useTheme } from "@/hooks/use-theme";
import { MoonStars, SunDim } from "@phosphor-icons/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui';
import { useDeviceTheme } from '@/hooks/dark-provider';

const appWindow = new Window('main');

export const Titlebar = () => {
  const { systemTheme } = useDeviceTheme()
  const { setTheme, dark: isDark } = useTheme();

  const handleMin = () => {
    appWindow.minimize()
  }
  // const handleMax = () => {
  //   appWindow.toggleMaximize()
  // }
  const handleClose = () => {
    appWindow.close()
  }
  return (
    <>
      <div data-tauri-drag-region className="titlebar">
        <DropdownMenu>
          <DropdownMenuTrigger className='absolute top-0 left-0 titlebar-button outline-none'>{!isDark ? <SunDim size={18} /> : <MoonStars size={18} />}</DropdownMenuTrigger>
          <DropdownMenuContent className='ml-2'>
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(systemTheme)}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="titlebar-button" onClick={handleMin} id="titlebar-minimize">
          <Minus size={14} />
        </div>
        {/* <div data-tauri-maximize-button-region className="titlebar-button" onClick={handleMax} id="titlebar-maximize">
      <Cards size={14} />
    </div> */}
        <div className="titlebar-button btn-danger" onClick={handleClose} id="titlebar-close">
          <X size={14} />
        </div>
      </div><div className="h-9 w-full" />
    </>
  )
}