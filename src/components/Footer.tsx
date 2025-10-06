export default function Footer() {
  return (
    <footer className="bg-white border-t text-center py-6 text-gray-600">
      <p>
        © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">ImagePro</span>. All rights reserved.
      </p>
    </footer>
  );
}
