type InteractionActor = { actor: string };
type InteractionEvent = { event: string; actor: string };
export type InteractionPayload = InteractionActor | InteractionEvent;

export function isEventInteraction(
  v: InteractionPayload
): v is InteractionEvent {
  return (v as any).event !== undefined;
}
