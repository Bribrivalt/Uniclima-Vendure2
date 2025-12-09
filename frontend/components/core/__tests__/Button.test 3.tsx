/**
 * Tests for Button Component
 * 
 * Unit tests covering:
 * - Rendering with different variants
 * - Size variations
 * - Click handlers
 * - Disabled state
 * - Loading state
 * - Icon support
 * - Accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
    // ============================================
    // BASIC RENDERING
    // ============================================

    describe('Rendering', () => {
        it('renders with children text', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByRole('button')).toHaveTextContent('Click me');
        });

        it('renders as a button element by default', () => {
            render(<Button>Test</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            render(<Button className="custom-class">Test</Button>);
            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });
    });

    // ============================================
    // VARIANTS
    // ============================================

    describe('Variants', () => {
        it('renders primary variant by default', () => {
            render(<Button>Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('primary');
        });

        it('renders secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('secondary');
        });

        it('renders outline variant', () => {
            render(<Button variant="outline">Outline</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('outline');
        });

        it('renders ghost variant', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('ghost');
        });

        it('renders danger variant', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('danger');
        });
    });

    // ============================================
    // SIZES
    // ============================================

    describe('Sizes', () => {
        it('renders medium size by default', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('md');
        });

        it('renders small size', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('sm');
        });

        it('renders large size', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('lg');
        });
    });

    // ============================================
    // INTERACTIONS
    // ============================================

    describe('Interactions', () => {
        it('calls onClick handler when clicked', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick}>Click</Button>);

            fireEvent.click(screen.getByRole('button'));

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('does not call onClick when disabled', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick} disabled>Disabled</Button>);

            fireEvent.click(screen.getByRole('button'));

            expect(handleClick).not.toHaveBeenCalled();
        });

        it('does not call onClick when loading', () => {
            const handleClick = jest.fn();
            render(<Button onClick={handleClick} loading>Loading</Button>);

            fireEvent.click(screen.getByRole('button'));

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    // ============================================
    // DISABLED STATE
    // ============================================

    describe('Disabled State', () => {
        it('applies disabled attribute when disabled', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('applies disabled class when disabled', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole('button')).toHaveClass('disabled');
        });
    });

    // ============================================
    // LOADING STATE
    // ============================================

    describe('Loading State', () => {
        it('shows loading indicator when loading', () => {
            render(<Button loading>Loading</Button>);
            // Check for loading spinner or aria-busy
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-busy', 'true');
        });

        it('disables button when loading', () => {
            render(<Button loading>Loading</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('applies loading class when loading', () => {
            render(<Button loading>Loading</Button>);
            expect(screen.getByRole('button')).toHaveClass('loading');
        });
    });

    // ============================================
    // ICONS
    // ============================================

    describe('Icons', () => {
        it('renders left icon when provided', () => {
            const LeftIcon = () => <span data-testid="left-icon">←</span>;
            render(<Button leftIcon={<LeftIcon />}>With Icon</Button>);

            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('renders right icon when provided', () => {
            const RightIcon = () => <span data-testid="right-icon">→</span>;
            render(<Button rightIcon={<RightIcon />}>With Icon</Button>);

            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('renders both icons when provided', () => {
            const LeftIcon = () => <span data-testid="left-icon">←</span>;
            const RightIcon = () => <span data-testid="right-icon">→</span>;
            render(
                <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
                    Both Icons
                </Button>
            );

            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });
    });

    // ============================================
    // FULL WIDTH
    // ============================================

    describe('Full Width', () => {
        it('applies fullWidth class when fullWidth is true', () => {
            render(<Button fullWidth>Full Width</Button>);
            expect(screen.getByRole('button')).toHaveClass('fullWidth');
        });
    });

    // ============================================
    // ACCESSIBILITY
    // ============================================

    describe('Accessibility', () => {
        it('has correct role', () => {
            render(<Button>Accessible</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('supports aria-label', () => {
            render(<Button aria-label="Custom label">Icon Only</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
        });

        it('is focusable', () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByRole('button');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('is not focusable when disabled', () => {
            render(<Button disabled>Not Focusable</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('disabled');
        });
    });

    // ============================================
    // TYPE ATTRIBUTE
    // ============================================

    describe('Type Attribute', () => {
        it('defaults to type="button"', () => {
            render(<Button>Default Type</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });

        it('can be type="submit"', () => {
            render(<Button type="submit">Submit</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
        });

        it('can be type="reset"', () => {
            render(<Button type="reset">Reset</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
        });
    });
});