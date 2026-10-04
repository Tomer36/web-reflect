"use client";

/* eslint-disable @next/next/no-img-element -- thumbnails and large files are pre-sized by scripts/build-images.mjs */
import { useEffect, useRef } from "react";
import { ArrowLeft, X, ZoomIn } from "lucide-react";

export type Photo = { key: string; thumb: string; large: string; width: number; height: number; alt: string };

type Labels = { zoom: string; close: string; prev: string; next: string; viewer: string };

// Thumbnail grid + full-screen viewer. Images come from content/portfolio/<slug>/
// (see scripts/build-images.mjs). Without JavaScript the thumbnails simply link
// to the large image.
export function Gallery({ photos, labels }: { photos: Photo[]; labels: Labels }) {
  const list = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dialog.current;
    const ul = list.current;
    if (!dlg || !ul || !dlg.showModal) return;
    const stage = dlg.querySelector(".lightbox-stage")!;
    const links = Array.from(ul.querySelectorAll<HTMLAnchorElement>("a"));
    const img = document.createElement("img");
    stage.appendChild(img);
    let current = 0;
    let token = 0;
    let startX: number | null = null;
    const rtl = () => document.documentElement.dir === "rtl";

    // Show the thumbnail that is already on screen straight away, then swap in
    // the large image once it has downloaded — no empty frame, no jump.
    function show(n: number, instant = false) {
      current = (n + links.length) % links.length;
      const thumb = links[current].querySelector("img")!;
      const mine = ++token;
      const swap = () => {
        if (mine !== token) return;
        img.alt = thumb.alt;
        img.src = thumb.currentSrc || thumb.src;
        img.classList.remove("is-switching");
        const large = new Image();
        large.onload = () => {
          if (mine === token) img.src = large.src;
        };
        large.src = links[current].href;
      };
      if (instant) return swap();
      img.classList.add("is-switching");
      setTimeout(swap, 140);
    }
    function close() {
      if (dlg!.classList.contains("is-closing")) return;
      dlg!.classList.add("is-closing");
      setTimeout(() => {
        dlg!.close();
        dlg!.classList.remove("is-closing");
      }, 180);
    }

    const onThumb = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;
      e.preventDefault();
      show(links.indexOf(link), true);
      dlg.classList.remove("is-closing");
      dlg.showModal();
    };
    const onDialogClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-lb]");
      if (!btn || btn.dataset.lb === "close") close();
      else show(current + (btn.dataset.lb === "next" ? 1 : -1));
    };
    // Esc: fade out instead of disappearing at once.
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    // Arrow keys follow the reading direction; swipe follows the finger.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      show(current + ((e.key === "ArrowLeft") === rtl() ? 1 : -1));
    };
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 48) return;
      show(current + (dx > 0 === rtl() ? 1 : -1));
    };
    // Return focus without scrolling the page to the thumbnail.
    const onClose = () => links[current]?.focus({ preventScroll: true });

    ul.addEventListener("click", onThumb);
    dlg.addEventListener("click", onDialogClick);
    dlg.addEventListener("cancel", onCancel);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("touchstart", onTouchStart, { passive: true });
    dlg.addEventListener("touchend", onTouchEnd, { passive: true });
    dlg.addEventListener("close", onClose);
    return () => {
      ul.removeEventListener("click", onThumb);
      dlg.removeEventListener("click", onDialogClick);
      dlg.removeEventListener("cancel", onCancel);
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("touchstart", onTouchStart);
      dlg.removeEventListener("touchend", onTouchEnd);
      dlg.removeEventListener("close", onClose);
      img.remove();
    };
  }, [photos]);

  if (!photos.length) return null;

  return (
    <>
      <ul className="gallery" ref={list}>
        {photos.map((photo) => (
          <li key={photo.key}>
            <a href={photo.large}>
              <img
                src={photo.thumb}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
              <span className="zoom-badge" aria-hidden="true">
                <ZoomIn className="icon" size={16} strokeWidth={1.5} />
              </span>
              <span className="sr-only">{labels.zoom}</span>
            </a>
          </li>
        ))}
      </ul>

      <dialog className="lightbox" ref={dialog} aria-label={labels.viewer}>
        <div className="lightbox-stage" />
        <button className="lightbox-btn lightbox-close" type="button" data-lb="close" aria-label={labels.close}>
          <X className="icon" size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button className="lightbox-btn lightbox-prev" type="button" data-lb="prev" aria-label={labels.prev}>
          <ArrowLeft className="icon icon-rev" size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button className="lightbox-btn lightbox-next" type="button" data-lb="next" aria-label={labels.next}>
          <ArrowLeft className="icon icon-dir" size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}
