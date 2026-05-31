import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/workspaces/$id/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/workspaces/$id/sources", params: { id: params.id } });
  },
});
