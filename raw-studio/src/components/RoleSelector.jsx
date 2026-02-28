import Button from "@/components/Button";

const ROLES = ["SERVICE", "ADMIN"];

export default function RoleSelector({ selectedRole, onRoleChange }) {
  return (
    <div className="flex gap-2 flex-wrap text-xs">
      {ROLES.map((role) => (
        <Button
          variant={selectedRole === role ? "primary" : "ghost"}
          size="sm"
          key={role}
          type="button"
          onClick={() => onRoleChange(role)}
        >
          {role}
        </Button>
      ))}
    </div>
  );
}
