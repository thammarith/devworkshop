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
    <></>
  );
};

export default Header;
