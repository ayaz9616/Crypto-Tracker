export default function EmptyState({ icon = null, title, description, action }) {
  return (
    <div className="text-center py-16">
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <h3 className="text-2xl font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
