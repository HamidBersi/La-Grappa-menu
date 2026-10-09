type ItaliaBarProps = {
  className?: string;
};

export function ItaliaBar({ className = "h-[3px] w-16" }: ItaliaBarProps) {
  return (
    <div className={`flex overflow-hidden rounded-full ${className}`} aria-hidden>
      <span className="flex-1 bg-leaf" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-wine" />
    </div>
  );
}
