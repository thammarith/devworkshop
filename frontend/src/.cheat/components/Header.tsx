import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  userName: string;
  onLogout?: () => void;
}

const Header = ({ userName, onLogout }: HeaderProps) => {
  return (
    <div className="w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="text-lg">Chat Room</span>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="flex items-center gap-2 border-l pl-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userName}</span>
            {onLogout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="ml-1 cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
