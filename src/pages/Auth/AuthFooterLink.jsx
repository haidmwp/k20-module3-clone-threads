import { Link } from "react-router";

export default function AuthFooterLink({ text, linkText, to }) {
  return (
    <p className="mt-6 text-center text-[15px] text-muted-foreground">
      {text}{" "}
      <Link to={to} className="font-semibold text-foreground hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
