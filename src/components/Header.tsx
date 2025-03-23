import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface HeaderProps {
  userName: string;
}

const Header = ({ userName }: HeaderProps) => {
  return (
    <div className=" w-full border-b bg-background/95 backdrop-blur">
      <div className=" flex h-14 items-center justify-between px-5">
        <span className="text-xl">Conversations</span>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="flex items-center gap-2 border-l pl-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
