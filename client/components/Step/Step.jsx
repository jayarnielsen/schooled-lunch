import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import css from './Step.css';

const Step = ({ index, itemId, stepId, isActive, content, clickHandler }) => (
  <Draggable type={`STEP-${itemId}`} draggableId={stepId} index={index}>
    {provided => (
      <li
        className={css.step}
        data-active={isActive}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div className={css.stepNum} {...provided.dragHandleProps}>
          <span>{index + 1}.</span>
        </div>
        <div className={css.stepDirections} onClick={clickHandler}>
          {content}
        </div>
      </li>
    )}
  </Draggable>
);

Step.displayName = 'Step';
export default Step;
