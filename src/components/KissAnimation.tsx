import { useEffect, useState } from "react";
import Image from "next/image";

const KissAnimation = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <Image
        className="w-16 h-16"
        src="/kiss.svg"
        alt="Kiss"
        width={32}
        height={32}
      />
    </div>
  );
};

export default KissAnimation;
