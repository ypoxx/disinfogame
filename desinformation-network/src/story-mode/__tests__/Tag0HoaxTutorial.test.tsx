/**
 * Tag-0-Hoax-Tutorial (Zielbild §10/§15, O7): der folgenlose Zwei-Balken-Aha-Beat.
 * Prüft den Flow intro → wählen → ON AIR (beide Balken + Echo) → Lektion → Brücke → onComplete.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag0HoaxTutorial } from '../components/Tag0HoaxTutorial';

describe('Tag0HoaxTutorial — Zwei-Balken-Onboarding', () => {
  it('führt vom Intro über einen Köder zum ON-AIR-Echo mit beiden Läufern', () => {
    render(<Tag0HoaxTutorial onComplete={() => {}} />);
    // Intro: Marina bietet die Probier-Zone an.
    expect(screen.getByText(/Tag 0/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/ZEIG MIR DAS/));
    // Auswahl: drei Köder.
    expect(screen.getByText(/Stadttauben/)).toBeInTheDocument();
    expect(screen.getByText(/Trinkwasser/)).toBeInTheDocument();
    expect(screen.getByText(/Brücke wurde nie gebaut/)).toBeInTheDocument();
    // Einen Köder wählen → ON AIR mit beiden Balken + Ferro-Faktencheck.
    fireEvent.click(screen.getByText(/Trinkwasser/));
    expect(screen.getByText(/ON AIR/)).toBeInTheDocument();
    expect(screen.getByText(/SONNTAGSFRAGE/)).toBeInTheDocument();
    expect(screen.getByText(/ABWEHR/)).toBeInTheDocument();
    expect(screen.getByText(/Ferro/)).toBeInTheDocument();
    expect(screen.getByText(/Die Abgehängten/)).toBeInTheDocument();
  });

  it('schließt über die Lektion (zweiter Balken) und die Brücke mit onComplete ab', () => {
    const onComplete = vi.fn();
    render(<Tag0HoaxTutorial onComplete={onComplete} />);
    fireEvent.click(screen.getByText(/ZEIG MIR DAS/));
    fireEvent.click(screen.getByText(/Stadttauben/));
    fireEvent.click(screen.getByText(/WEITER/));
    // Lektion: der „zweite Balken" wird benannt.
    expect(screen.getByText(/zweiten Balken/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/VERSTANDEN/));
    // Brücke → Abschluss trägt die gespielte Köder-ID.
    fireEvent.click(screen.getByText(/AN DIE ARBEIT/));
    expect(onComplete).toHaveBeenCalledWith('tauben');
  });
});
