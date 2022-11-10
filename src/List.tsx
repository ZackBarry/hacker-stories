import React from 'react';
import { sortBy } from 'lodash';

import { Story, Stories } from './types';

import './App.css';
import Delete from './close-circle-outline.svg';
import ArrowUp from './arrow-up-outline.svg';
import ArrowDown from './arrow-down-outline.svg';


const SORTS = {
    NONE: (list: Stories) => {
        return list;
    },
    TITLE: (list: Stories) => {
        return sortBy(list, 'title');
    },
    AUTHOR: (list: Stories) => {
        return sortBy(list, 'author');
    },
    COMMENTS: (list: Stories) => {
        return sortBy(list, 'num_comments').reverse();
    },
    POINTS: (list: Stories) => {
        return sortBy(list, 'points').reverse();
    },
}

type ListProps = {
    list: Stories;
    onRemoveItem: (item: Story) => void;
}

const List = ({list, onRemoveItem}: ListProps) => {
    console.log('LIST');

    const [sort, setSort] = React.useState({
        sortKey: 'NONE',
        reverse: false,
    });

    const onSortClick = (columnName: string) => {
        setSort({
            sortKey: columnName,
            reverse: sort.sortKey === columnName ? !sort.reverse : false,
        })
    }

    list = SORTS[sort.sortKey as keyof typeof SORTS](list);

    if (sort.reverse) list.reverse();

    return (
        <>
            <Buttons sortColumn={sort.sortKey} reverse={sort.reverse} onSortClick={onSortClick}/>
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

type ButtonsProps = {
    sortColumn: string,
    reverse: boolean,
    onSortClick: (columnName: string) => void,
}

const Buttons = ({ sortColumn, reverse, onSortClick }: ButtonsProps) => {
    const direction = (
        <img
            src={reverse ? ArrowDown : ArrowUp}
            className="directionArrow"
            alt="arrow"
            height="18px" 
            width="18px"
        />
    )
    return (
        <div className="item">
            <span style={{ width: '40%' }}>
                <button
                    type='button'
                    className={'sort-button' + (sortColumn === 'TITLE' ? ' clicked' : '')}
                    onClick={() => onSortClick('TITLE')}
                >Sort</button>
                {sortColumn === 'TITLE' && direction}
            </span>
            <span style={{ width: '30%' }}>
                <button
                    type='button'
                    className={'sort-button' + (sortColumn === 'AUTHOR' ? ' clicked' : '')}
                    onClick={() => onSortClick('AUTHOR')}
                >Sort</button>
                {sortColumn === 'AUTHOR' && direction}
            </span>
            <span style={{ width: '10%' }}>
                <button
                    type='button'
                    className={'sort-button' + (sortColumn === 'COMMENTS' ? ' clicked' : '')}
                    onClick={() => onSortClick('COMMENTS')}
                >Sort</button>
                {sortColumn === 'COMMENTS' && direction}
            </span>
            <span style={{ width: '10%' }}>
                <button
                    type='button'
                    className={'sort-button' + (sortColumn === 'POINTS' ? ' clicked' : '')}
                    onClick={() => onSortClick('POINTS')}
                >Sort</button>
                {sortColumn === 'POINTS' && direction}
            </span>
        </div>
    )
}

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
                <img src={Delete} alt="check" height="18px" width="18px"/>
            </button>
            </span>
        </div>
    )
}

export default List;