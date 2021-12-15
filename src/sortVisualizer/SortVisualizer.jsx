import React, { useState, useEffect, useRef } from 'react';
import './SortVisualizer.css';
import { getInsertionSortAnimations } from '../algorithms/sorting/InsertionSort';
import { getBubbleSortAnimations } from '../algorithms/sorting/BubbleSort';
import { getQuickSortAnimations } from '../algorithms/sorting/QuickSort';
import { getMergeSortAnimations } from '../algorithms/sorting/MergeSort';
import { getSelectionSortAnimations } from '../algorithms/sorting/SelectionSort';
import { getOptimizedBubbleSortAnimations } from '../algorithms/sorting/OptimizedBubbleSort';
import { getHeapSortAnimations } from '../algorithms/sorting/HeapSort';
import { getCocktailSortAnimations } from '../algorithms/sorting/CocktailSort';
import { getCombSortAnimations } from '../algorithms/sorting/CombSort';
import { getPancakeSortAnimations } from '../algorithms/sorting/PancakeSort';

const ARR_LEN = 100;
const MIN_NUM = 5;
const MAX_NUM = 80;
const DELAY = 5;
const ACCESSED_COLOUR = 'turquoise';
const SORTED_COLOUR = 'green';

const shuffle = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
}

export default function SortVisualizer() {
    const [arr, setArr] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const containerRef = useRef(null);

    useEffect(initialiseArray, []);

    function initialiseArray() {
        if (isSorting) return;
        if (isSorted) resetArrayColour();
        setIsSorted(false);
        const arr = [];
        for (let i = 0; i < ARR_LEN; i++) {
          arr.push((MAX_NUM - MIN_NUM) * (i / ARR_LEN) + MIN_NUM);
        }
        shuffle(arr);
        setArr(arr);
    }

    function insertionSort() {
        const animations = getInsertionSortAnimations(arr);
        animateArrayUpdate(animations);
    }

    function bubbleSort(){
      const animations = getBubbleSortAnimations(arr);
      animateArrayUpdate(animations)
    }

    function quickSort(){
      const animations = getQuickSortAnimations(arr);
      animateArrayUpdate(animations)
    }

    function mergeSort(){
      const animations = getMergeSortAnimations(arr);
      animateArrayUpdate(animations)
    }

    function selectionSort(){
      const animations = getSelectionSortAnimations(arr);
      animateArrayUpdate(animations);
    }

    function optimizedBubbleSort(){
      const animations = getOptimizedBubbleSortAnimations(arr);
      animateArrayUpdate(animations)
    }

    function heapSort(){
      const animations = getHeapSortAnimations(arr);
      animateArrayUpdate(animations);
    }

    function cocktailSort(){
      const animations = getCocktailSortAnimations(arr);
      animateArrayUpdate(animations)
    }

    function combSort(){
      const animations = getCombSortAnimations(arr);
      animateArrayUpdate(animations);
    }

    function pancakeSort(){
      const animations = getPancakeSortAnimations(arr);
      animateArrayUpdate(animations);
    }

    function animateArrayUpdate(animations) {
        if (isSorting) return;
        setIsSorting(true);
        animations.forEach(([comparison, swapped], index) => {
            setTimeout(() => {
                if (!swapped) {
                    if (comparison.length === 2) {
                        const [i, j] = comparison;
                        animateArrayAccess(i);
                        animateArrayAccess(j);
                    } else {
                        const [i] = comparison;
                        animateArrayAccess(i);
                    }
                } else {
                    setArr((prevArr) => {
                        const [k, newValue] = comparison;
                        const newArr = [...prevArr];
                        newArr[k] = newValue;
                        return newArr;
                    });
                }
            }, index * DELAY);
        });
        setTimeout(() => {
            animateSortedArray();
        }, animations.length * DELAY);
    }

    function animateArrayAccess(index) {
        const arrayBars = containerRef.current.children;
        const arrayBarStyle = arrayBars[index].style;
        setTimeout(() => {
            arrayBarStyle.backgroundColor = ACCESSED_COLOUR;
        }, DELAY);
        setTimeout(() => {
            arrayBarStyle.backgroundColor = '';
        }, DELAY * 2);
    }

    function animateSortedArray() {
        const arrayBars = containerRef.current.children;
        for (let i = 0; i < arrayBars.length; i++) {
            const arrayBarStyle = arrayBars[i].style;
            setTimeout(
                () => (arrayBarStyle.backgroundColor = SORTED_COLOUR),
                i * DELAY,
            );
        }
        setTimeout(() => {
            setIsSorted(true);
            setIsSorting(false);
        }, arrayBars.length * DELAY);
    }

    function resetArrayColour() {
        const arrayBars = containerRef.current.children;
        for (let i = 0; i < arr.length; i++) {
            const arrayBarStyle = arrayBars[i].style;
            arrayBarStyle.backgroundColor = '';
        }
    }
    return (
        <div className="visualizer-container">
          <div className="array-container" ref={containerRef}>
            {arr.map((barHeight, index) => (
              <div
                className="array-bar"
                style={{
                  height: `${barHeight}vmin`,
                  width: `${100 / ARR_LEN}vw`,
                }}
                key={index}
              ></div>
            ))}
          </div>
          <footer className="app-footer">
            <ul>
              <li>
                <button className="app-button" onClick={initialiseArray}>
                  Create new array
                </button>
              </li>
              <li>
                <button className="app-button" onClick={insertionSort}>
                  Insertion sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={bubbleSort}>
                  Bubble sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={quickSort}>
                  Quick sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={mergeSort}>
                  Merge sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={selectionSort}>
                  Selection sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={optimizedBubbleSort}>
                  Opt Bubble sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={heapSort}>
                  Heap sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={cocktailSort}>
                  Cocktail sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={combSort}>
                  Comb sort
                </button>
              </li>
              <li>
                <button className="app-button" onClick={pancakeSort}>
                  Pancake sort
                </button>
              </li>
            </ul>
          </footer>
        </div>
      );
}