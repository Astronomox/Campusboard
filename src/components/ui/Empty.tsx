export function Empty({ icon = "📭", title, body }: { icon?: string; title: string; body?: string }) {
  return (
    <div className="empty">
      <div className="box grain" style={{ fontSize: 28 }}>{icon}</div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
    </div>
  );
}
