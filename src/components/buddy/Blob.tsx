import { mascotSrc, type MascotPose } from "@/lib/brand";

/** Sheet crop. Not next/image: keep the paper cream as-is. */
export function Blob({
  pose,
  alt = "",
  className,
  todo,
}: {
  pose: MascotPose;
  alt?: string;
  className?: string;
  /** POSE À FAIRE — dashed stand-in, we do not warp the PNG. */
  todo?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mascotSrc(pose)}
      alt={alt}
      title={todo}
      data-pose-todo={todo || undefined}
      className={[
        "pointer-events-none select-none",
        todo ? "outline-line outline-dashed outline-1 outline-offset-2" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
