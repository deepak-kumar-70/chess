import { SiChessdotcom } from "react-icons/si";
import { TbChessRookFilled } from "react-icons/tb";
import { FaChessKnight } from "react-icons/fa6";
import { TbChessBishopFilled } from "react-icons/tb";
import { GiChessQueen } from "react-icons/gi";
import { GiChessKing } from "react-icons/gi";

const pieces = [
  { key: "p", icon: SiChessdotcom },
  { key: "P", icon: SiChessdotcom },
  { key: "r", icon: TbChessRookFilled },
  { key: "R", icon: TbChessRookFilled },
  { key: "n", icon: FaChessKnight },
  { key: "N", icon: FaChessKnight },
  { key: "b", icon: TbChessBishopFilled },
  { key: "B", icon: TbChessBishopFilled },
  { key: "q", icon: GiChessQueen },
  { key: "Q", icon: GiChessQueen },
  { key: "k", icon: GiChessKing },
  { key: "K", icon: GiChessKing },
];

export default pieces;
