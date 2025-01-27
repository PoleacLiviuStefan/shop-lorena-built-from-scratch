
import Image from "next/image"
import Link from "next/link";

const Benefit = ({ iconSrc, name, path }) => {
  return (
    <Link href={`/categorii/${path}`}>
      <div className="flex flex-col items-center text-center transition-transform duration-300 ease-in-out  hover:scale-[1.1] hover:-mt-3 z-10">
        <div className="flex justify-center items-center w-[90px] lg:w-[140px] h-[90px] lg:h-[140px] rounded-full shadow-xl bg-[#FFC2EA] whitespace-nowrap transition-colors duration-300 delay-300 ease-in-out  hover:bg-[#FC86D4]">
          <Image
            className="w-[45px] lg:w-[80px] h-[50px] lg:h-[80px] transition-transform duration-300 ease-in-out "
            src={iconSrc}
            alt={name}
          />
        </div>
        <h3 className="mt-4 font-bold text-[14px] lg:text-[16px] transition-opacity duration-300 ease-in-out ">
          {name}
        </h3>
      </div>
    </Link>
  );
};

export default Benefit;
