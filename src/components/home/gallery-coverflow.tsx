import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const GALLERY_SLIDES = [
  {
    src: "/images/gallery/_ROS5463.jpg",
    alt: "Hillvary zip hoodie, close-up of the reflective cross logo",
    title: "Armor of Light Zip Jacket",
  },
  {
    src: "/images/gallery/_ROS5546.jpg",
    alt: "Hillvary training shorts with zip security pocket",
    title: "Kingdom Training Shorts",
  },
  {
    src: "/images/gallery/_ROS5469.jpg",
    alt: "Hillvary sleeveless compression top, front view",
    title: "Faithful Sleeveless Compression Top",
  },
   {
    src: "/images/gallery/_ROS5576.jpg",
    alt: "Hillvary sleeveless compression top, front view",
    title: "Faithful Sleeveless Compression Top",
  },
  {
    src: "/images/gallery/_ROS5560.jpg",
    alt: "Hillvary sleeveless compression top, front view",
    title: "Faithful Sleeveless Compression Top",
  },
  {
    src: "/images/gallery/_ROS5566.jpg",
    alt: "Hillvary sleeveless compression top, front view",
    title: "Faithful Sleeveless Compression Top",
  },
  // {
  //   src: "/images/gallery/tank.png",
  //   alt: "Hillvary sleeveless compression top, front view",
  //   title: "Faithful Sleeveless Compression Top",
  // },
];

export function GalleryCoverflow() {
  return (
    <section id="gallery" className="scroll-mt-24 py-14">
      <div className="mx-auto mb-2 max-w-[1800px] px-6 md:px-12">
        <h2 className="text-base font-medium">Our Gallery</h2>
      </div>

      <CoverflowCarousel
        slides={GALLERY_SLIDES}
        label="Hillvary lifestyle gallery"
        cardClassName="rounded-2xl"
        // showNavigation
        showPagination
      />
    </section>
  );
}
