
import Image, { StaticImageData } from "next/image";


type HeroProps = {
  image: string | StaticImageData; // URL-ul imaginii
  imageWidth?: string; // Lățimea imaginii pe desktop
  imageWidthMobile?: string; // Lățimea imaginii pe mobil
  backCircle?: boolean; // Dacă fundalul cercului este activat
};


const Hero: React.FC<HeroProps> = ({
  image,
  imageWidth = "500",
  imageWidthMobile = "400",
  backCircle = false,
}) => {
  return (
    <div className="h-[500px] w-full bg-gradient-to-b from-[#ffc2ea] via-[#ffc2ea] to-white border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        {backCircle && <span className="absolute lg:top-0 w-[300px] h-[300px] rounded-[50%] bg-pink-300" />}
        <Image
          alt="alt"
          loading="eager"
          src={image}
          width={parseInt(imageWidth, 10)} // Conversie la număr
  height={parseInt(imageWidth, 10) * 1.5} // Ajustează proporțiile dacă imaginea nu este pătrată
          className={`absolute bottom-0 h-auto ${imageWidthMobile ? `w-[${imageWidthMobile}px]` : "w-[400px]"} ${imageWidth ? `lg:w-[${imageWidth}px]` : "lg:w-[500px]"}`}
   
        />
      </div>
    </div>
  )
}

export default Hero
