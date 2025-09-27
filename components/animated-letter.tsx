"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function AnimatedLetter() {
  const router = useRouter();

  const handleLetterClick = () => {
    router.push("/contacto");
  };
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center gap-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            ¿Tienes una consulta?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Envíanos tu mensaje y nos pondremos en contacto contigo lo antes posible
          </p>
        </div>

        {/* Animated Letter */}
        <div 
          className="letter-image cursor-pointer transition-transform hover:scale-105" 
          onClick={handleLetterClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLetterClick();
            }
          }}
          aria-label="Hacer clic para ir a la página de contacto"
        >
          <div className="animated-mail">
            <div className="back-fold"></div>
            <div className="letter">
              <div className="letter-border"></div>
              <div className="letter-title"></div>
              <div className="letter-context"></div>
              <div className="letter-stamp">
                <div className="letter-stamp-inner"></div>
              </div>
            </div>
            <div className="top-fold"></div>
            <div className="body"></div>
            <div className="left-fold"></div>
          </div>
          <div className="shadow"></div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <p className="text-white/90 text-base">
            Haz clic en el sobre para abrir tu consulta
          </p>
          <p className="text-white/70 text-sm">
            Te llevaremos a nuestro formulario de contacto profesional
          </p>
        </div>
      </div>

      <style jsx>{`
        .letter-image {
          position: relative;
          width: 200px;
          height: 200px;
          cursor: pointer;
        }

        .animated-mail {
          position: absolute;
          height: 150px;
          width: 200px;
          top: 25px;
          left: 0;
          transition: .4s;
        }

        .body {
          position: absolute;
          bottom: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 100px 200px;
          border-color: transparent transparent #e95f55 transparent;
          z-index: 2;
        }

        .top-fold {
          position: absolute;
          top: 50px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 50px 100px 0 100px;
          transform-origin: 50% 0%;
          transition: transform .4s .4s, z-index .2s .4s;
          border-color: #cf4a43 transparent transparent transparent;
          z-index: 2;
        }

        .back-fold {
          position: absolute;
          bottom: 0;
          width: 200px;
          height: 100px;
          background: #cf4a43;
          z-index: 0;
        }

        .left-fold {
          position: absolute;
          bottom: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 50px 0 50px 100px;
          border-color: transparent transparent transparent #e15349;
          z-index: 2;
        }

        .letter {
          left: 20px;
          bottom: 0px;
          position: absolute;
          width: 160px;
          height: 60px;
          background: white;
          z-index: 1;
          overflow: hidden;
          transition: .4s .2s;
        }

        .letter-border {
          height: 10px;
          width: 100%;
          background: repeating-linear-gradient(
            -45deg,
            #cb5a5e,
            #cb5a5e 8px,
            transparent 8px,
            transparent 18px
          );
        }

        .letter-title {
          margin-top: 10px;
          margin-left: 5px;
          height: 10px;
          width: 40%;
          background: #cb5a5e;
        }

        .letter-context {
          margin-top: 10px;
          margin-left: 5px;
          height: 10px;
          width: 20%;
          background: #cb5a5e;
        }

        .letter-stamp {
          margin-top: 30px;
          margin-left: 120px;
          border-radius: 100%;
          height: 30px;
          width: 30px;
          background: #cb5a5e;
          opacity: 0.3;
        }

        .shadow {
          position: absolute;
          top: 200px;
          left: 50%;
          width: 400px;
          height: 30px;
          transition: .4s;
          transform: translateX(-50%);
          border-radius: 100%;
          background: radial-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.0), rgba(0,0,0,0.0));
        }

        .letter-image:hover .animated-mail {
          transform: translateY(50px);
        }

        .letter-image:hover .animated-mail .top-fold {
          transition: transform .4s, z-index .2s;
          transform: rotateX(180deg);
          z-index: 0;
        }

        .letter-image:hover .animated-mail .letter {
          height: 180px;
        }

        .letter-image:hover .shadow {
          width: 250px;
        }
      `}</style>
    </section>
  )
}