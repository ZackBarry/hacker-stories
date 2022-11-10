import React from 'react';

import { Story, Stories } from './types';

import Check from './check-circle.svg';

type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
}

const List = ({list, onRemoveItem}: ListProps) => {
    return (
        <>
            {list.map(item => (
            <Item 
                key={item.objectID} 
                item={item} 
                onRemoveItem={onRemoveItem}
            />
            ))}
        </>
    )
};

type ItemProps = {
  item: Story,
  onRemoveItem: (item: Story) => void;
};

const Item = ({ item, onRemoveItem }: ItemProps) => {
  return (
    <div className="item">
      <span style={{ width: '40%' }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
      <span style={{ width: '10%' }}>
        <button 
          type='button' 
          onClick={() => onRemoveItem(item)}
          className="button button_small"
        >
          <img src={Check} alt="check" height="18px" width="18px"/>
        </button>
      </span>
    </div>
  )
}

export default List;