export default function Badge({ status }) {
  if (status === "Pending") {
    return (
      <div className="flex flex-1 flex-row-reverse">
        <div className="badge badge-warning gap-2">Pending</div>
      </div>
    );
  } else if (status === "Rejected") {
    return (
      <div className="flex flex-1 flex-row-reverse">
        <div className="badge badge-error gap-2">Rejected</div>
      </div>
    );
  } else if (status === "Accepted") {
    return (
      <div className="flex flex-1 flex-row-reverse">
        <div className="badge badge-success gap-2">Accepted</div>
      </div>
    );
  }
}
