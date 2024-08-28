export default function NavButton({ name, loc }) {
  return (
    <div>
      <a href={loc} className="text-white">
        {name}
      </a>
    </div>
  );
}
