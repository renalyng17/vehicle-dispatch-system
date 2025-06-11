export default function NavItem({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      className="flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-[#F1FAE5] hover:text-green-800 active:scale-[0.98]"
    >
      <Icon className="w-6 h-6" />
      <span className="font-bold">{label}</span>
    </a>
  );
}
