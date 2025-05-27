import React from "react";
import { X, Github } from "lucide-react";

function AboutModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-icy rounded-[13px] p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-hornbill font-black text-twilight">About DebtMate</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} className="text-twilight" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-twilight mb-3">Our Mission</h3>
        <p className="mb-4 text-twilight">
          DebtMate helps you manage debts with your friends more efficiently. 
          Split bills, track expenses in groups, and settle debts without the awkward conversations.
        </p>
        
        <h3 className="text-xl font-bold text-twilight mb-3">Technologies</h3>
        <ul className="list-disc pl-5 mb-4 text-twilight">
          <li>Frontend: React 19, Tailwind CSS, Vite</li>
          <li>Backend: Hono.js, Node.js, TypeScript</li>
          <li>Database: SQLite with Prisma ORM</li>
          <li>Authentication: JWT with bcrypt</li>
        </ul>

        <h3 className="text-xl font-bold text-twilight mb-3">Repository</h3>
        <a 
          href="https://github.com/CSC105-2024/G16-DebtMate"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <Github size={20} />
          <span>github.com/CSC105-2024/G16-DebtMate</span>
        </a>

        <div className="mt-8 text-center text-twilight text-sm">
          &copy; {new Date().getFullYear()} DebtMate
        </div>
      </div>
    </div>
  );
}

export default AboutModal;