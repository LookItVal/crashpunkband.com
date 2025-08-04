"use client";
import React, { ReactElement, ReactNode, cloneElement, useEffect, useState, useRef, useCallback } from "react";
import "./FallingCanvas.css";
import Matter from "matter-js";


type FallingCanvasProps = {
  children: ReactNode;
  gravity?: number;
  mouseConstraintStiffness?: number;
  className?: string;
};

interface ReactElementWithProps extends ReactElement {
  props: {
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    mouseConstraintStiffness?: number;
    [key: string]: unknown;
  };
}

// Helper type for extracted styles
interface ExtractedStyles {
  textStyles: React.CSSProperties;
  containerStyles: React.CSSProperties;
}

const FallingCanvas: React.FC<FallingCanvasProps> = ({
  children,
  className = "",
  gravity = 1,
  mouseConstraintStiffness = 0.2,
}) => {
  const [processedContent, setProcessedContent] = useState<ReactNode>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  // Extract styles from an element, separating text styling from layout styling
  const extractStyles = useCallback((style?: React.CSSProperties): ExtractedStyles => {
    if (!style) return { textStyles: {}, containerStyles: {} };
    
    // Properties that should be applied to the container
    const containerProps = [
      'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
      'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
      'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
      'position', 'top', 'right', 'bottom', 'left', 'zIndex'
    ];
    
    const textStyles: React.CSSProperties = {};
    const containerStyles: React.CSSProperties = {};
    
    Object.entries(style).forEach(([key, value]) => {
      if (containerProps.includes(key)) {
        containerStyles[key as keyof React.CSSProperties] = value;
      } else {
        textStyles[key as keyof React.CSSProperties] = value;
      }
    });
    
    return { textStyles, containerStyles };
  }, []);

  const splitTextToSpans = useCallback((text: string, textStyle?: React.CSSProperties): ReactNode => {
    return text.split(/\s+/).map((word, i) => (
      <span key={i} className='world-item pointer-events-none' style={textStyle}>
        {word}
        {i < text.split(/\s+/).length - 1 ? " " : ""}
      </span>
    ));
  }, []);

  const processChild = useCallback((child: ReactNode, parentStyles: React.CSSProperties = {}): ReactNode => {
    if (typeof child === "string") {
      // No style info, just wrap words in spans with parent styles
      return splitTextToSpans(child, parentStyles);
    }

    if (React.isValidElement(child)) {
      const elementWithProps = child as ReactElementWithProps;
      const { style, children: innerChildren, ...rest } = elementWithProps.props;
      
      // Extract styles from the current element
      const { textStyles } = extractStyles(style);
      
      // Merge parent styles with current element's text styles
      const mergedTextStyles = { ...parentStyles, ...textStyles };
      

      // Recursively process children
      let processedChildren: ReactNode;
      if (typeof innerChildren === "string") {
        processedChildren = splitTextToSpans(innerChildren, mergedTextStyles);
      } else if (Array.isArray(innerChildren)) {
        processedChildren = React.Children.map(innerChildren, (child) => processChild(child, mergedTextStyles));
      } else if (innerChildren) {
        processedChildren = processChild(innerChildren, mergedTextStyles);
      } else {
        processedChildren = innerChildren;
      }

      // Create a new element without the container styles
      const newProps = {
        ...rest,
        style: textStyles
      };
      return cloneElement(child as ReactElement, newProps, processedChildren);
    }

    // For other types (numbers, booleans, etc.), just return as is
    return child;
  }, [extractStyles, splitTextToSpans]);

  useEffect(() => {
    // Process children once on mount or when children change
    const result = React.Children.map(children, (child) => processChild(child));
    setProcessedContent(result);
  }, [children, processChild]);

  useEffect(() => {
    if (!effectStarted) return;

    const {
      Engine,
      Render,
      World,
      Bodies,
      Runner,
      Mouse,
      MouseConstraint,
    } = Matter;

    const containerRect = containerRef.current!.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) {
      return;
    }

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current!,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
      },
    });

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

    const worldSpans = worldRef.current!.querySelectorAll(".world-item");
    const worldBodies: { elem: HTMLElement; body: Matter.Body }[] = [...worldSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      return { elem: elem as HTMLElement, body };
    });

    worldBodies.forEach(({ elem, body }) => {
      elem.style.position = "absolute";
      elem.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x / 2}px`;
      elem.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y / 2}px`;
      elem.style.transform = "none";
    });

    const mouse = Mouse.create(containerRef.current!);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...worldBodies.map((wb) => wb.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const updateLoop = () => {
      worldBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Matter.Engine.update(engine);
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        canvasContainerRef.current.removeChild(render.canvas);
      }
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [
    effectStarted,
    gravity,
    mouseConstraintStiffness,
    worldRef
  ]);

  const handleTrigger = () => {
    if (!effectStarted) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={handleTrigger}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={worldRef}
        className={`falling-text-target ${className}`}
      >
        {processedContent}
      </div>
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  );
};

export default FallingCanvas;