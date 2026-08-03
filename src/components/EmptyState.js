export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center bg-gray-100 rounded-full p-6 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-500 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
