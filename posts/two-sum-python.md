---
title: "Solving Two Sum in Python"
date: "2026-02-28"
description: "A deep dive into the classic Two Sum problem using hash maps for optimal performance."
---

# Solving Two Sum in Python

The **Two Sum** problem is a classic coding challenge often used in technical interviews. The goal is simple: given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`.

## The Brute Force Approach

The most straightforward way to solve this is to check every possible pair of numbers. This takes $O(n^2)$ time.

```python
def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
```

## The Optimal Approach: Hash Map

We can improve the time complexity to $O(n)$ by using a hash map (dictionary in Python) to store the numbers we've seen so far and their indices.

### How it works:
1. Iterate through the list once.
2. For each number, calculate its `complement` ($target - current\_number$).
3. If the `complement` is already in our map, we've found the pair!
4. Otherwise, add the current number and its index to the map.

```python
def twoSum(nums, target):
    prevMap = {}  # val : index

    for i, n in enumerate(nums):
        diff = target - n
        if diff in prevMap:
            return [prevMap[diff], i]
        prevMap[n] = i
    return
```

## Complexity Analysis

- **Time Complexity**: $O(n)$ because we only traverse the list once.
- **Space Complexity**: $O(n)$ because in the worst case, we store all elements in the hash map.

This approach is highly efficient and demonstrates the power of using the right data structure for the job.
