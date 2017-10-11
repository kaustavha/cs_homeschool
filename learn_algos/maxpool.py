# -*- coding: iso-8859-15 -*-
# Programming Challenge Description:
# Implement Max Pooling Algorithm
# In Neural Networks used for Visual Recognition some layers perform a Max Pooling operation on an image represented as an NxM matrix of intensities (most often it is squared but we do not make this assumption in this task). Max Pooling consists of the following: given a window of size KxL, “slide” the window through the array without overlapping and return the maximum values for each window.

# It’s best explained with an example:

# Given a 4x4 matrix

# 1 1 2 4
# 5 6 7 8
# 3 2 1 0
# 1 2 3 4
# and a square window of size 2x2, the subregions are:

# 1 1 | 2 4
# 5 6 | 7 8
# --------
# 3 2 | 1 0
# 1 2 | 3 4
# The corresponding Max Pooled values for each subregions are:

# 6 8
# 3 4 
# A square window of size 1x1 will return the original matrix.

# For this task we will make the following assumptions:

# Matrices will only contain integers in the range (-1000, 1000)
# Matrices are always 2 dimensional (but not always square) and non-empty
# We will always use a square window (so we’ll provide only 1 size)
# The output should be the sum of Max Pooled values (e.g., 21 for the example above)
# If the window cannot fit into the matrix without overlapping, the output should be the string “NONE”

# Input:
# The rows of the matrix each on a separate line, followed by a blank line, and then a single number for the Max Pooling window size.


# Output:
# Print to standard output the sum of the Max Pooled values, or the string “NONE” if assumptions are not fulfilled.


# Test 1
# Test Input Download Test Input20 200
# -13 134
# 120 32
# -120 12

# 4
# Expected Output Download Test OutputNONE
# Test 2
# Test Input Download Test Input20 200
# -13 134
# 120 32
# -120 12

# 2
# Expected Output Download Test Output320
# Test 3
# Test Input Download Test Input1 1 2 4
# 5 6 7 8
# 3 2 1 0
# 1 2 3 4 

# 2
# Expected Output Download Test Output21

from operator import mul

globalWindows = []
maxes = []
matrix = [[1,1,2,4],
          [5,6,7,8],
          [3,2,1,0],
          [1,2,3,4]]
windowSize = 2
currentWindow = 0
windowParamsHashList = []

def findMax(matrix):
  max = 0
  for row in matrix:
    for colv in row:
      if colv > max:
        max = colv
  return max

def spliceCall(matrix, rowStart, rowEnd, colStart, colEnd, windowSize):
  currentParamsStr = ",".join(str(x) for x in [rowStart, rowEnd, colStart, colEnd])
  if currentParamsStr in windowParamsHashList:
    return
  else:
    windowParamsHashList.append(currentParamsStr)
  temp = []
  col = []
  for i in range(rowStart,rowEnd):
    for j in range(colStart, colEnd):
      col.append(matrix[i][j])
    temp.append(col)
    col = []
  globalWindows.append(temp)
  if colEnd+windowSize-1 < len(matrix[0]):
    spliceCall(matrix, rowStart,rowEnd,colStart+windowSize, colEnd+windowSize, windowSize)
  if rowEnd+windowSize-1 < len(matrix):
    spliceCall(matrix, rowStart+windowSize, rowEnd+windowSize, colStart, colEnd, windowSize)
  maxes.append(findMax(temp))
  

def startSplice(matrix, windowSize):
  spliceCall(matrix, 0,windowSize,0,windowSize,windowSize)

startSplice(matrix, windowSize)
#print(maxes)
print(reduce(mul,maxes))