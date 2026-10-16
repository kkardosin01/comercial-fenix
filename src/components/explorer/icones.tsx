import {
  Activity, Ambulance, Baby, Droplets, Dumbbell, FlaskConical, HeartPulse, Microscope,
  PawPrint, Scissors, Siren, Stethoscope, Tractor, type LucideIcon, type LucideProps,
} from "lucide-react";
import { createElement } from "react";

// Ícones disponíveis para as áreas (o painel admin oferece estas opções).
export const ICONES_AREA: Record<string, LucideIcon> = {
  siren: Siren,
  "heart-pulse": HeartPulse,
  baby: Baby,
  scissors: Scissors,
  activity: Activity,
  droplets: Droplets,
  ambulance: Ambulance,
  "paw-print": PawPrint,
  tractor: Tractor,
  dumbbell: Dumbbell,
  "flask-conical": FlaskConical,
  microscope: Microscope,
  stethoscope: Stethoscope,
};
export const iconeArea = (nome: string) => ICONES_AREA[nome] ?? Stethoscope;

export function IconeArea({ nome, ...props }: { nome: string } & LucideProps) {
  return createElement(iconeArea(nome), props);
}
