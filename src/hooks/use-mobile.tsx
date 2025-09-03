import * as React from "react"

// Define el breakpoint para considerar "mobile"
const MOBILE_BREAKPOINT = 768

// Hook para detectar si la pantalla es móvil
export function useIsMobile() {
  // Estado para saber si es móvil
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // MediaQuery para el breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    // Función que actualiza el estado según el tamaño de la ventana
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // Escucha cambios en el tamaño de la pantalla
    mql.addEventListener("change", onChange)
    // Estado inicial
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // Limpia el listener al desmontar
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Devuelve true si es móvil, false si no
  return !!isMobile
}