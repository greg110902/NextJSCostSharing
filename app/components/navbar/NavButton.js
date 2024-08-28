export default function NavButton({ name, loc }) {
  return (
    <div>
      <a href={loc} className="text-white p-5">
        {name}
      </a>
    </div>
  );
}
