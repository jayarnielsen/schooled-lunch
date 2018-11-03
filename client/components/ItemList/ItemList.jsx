import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import css from './ItemList.css';

export default ({ children, recipeId }) => (
  <Droppable type="ITEM" droppableId={recipeId}>
    {provided => (
      <div
        className={css.steps}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {children}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);
