import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/swiper-bundle.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper-bundle.css";

type PhotoSwiper = {
  photos: string[];
};

const PhotoSwiper: React.FC<PhotoSwiper> = ({ photos }) => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      navigation
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
    >
      {photos?.length! > 0
        ? photos?.map((photo) => (
            <SwiperSlide key={photo}>
              <div className="relative group cursor-pointer">
                <img
                  key={photo}
                  src={photo}
                  alt=""
                  className=" object-cover rounded-md"
                />
              </div>
            </SwiperSlide>
          ))
        : null}
    </Swiper>
  );
};

export default PhotoSwiper;
