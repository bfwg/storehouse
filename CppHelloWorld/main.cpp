// Exercises: Functions
// Exercise 1

#include <iostream>
#include "main.h"
using namespace std;

class IntegerArray {
public:
    int size;
    int *data;
    IntegerArray(int size) {
      data = new int[size];
      this->size = size;
    }
    IntegerArray(IntegerArray &o) {
      data = new int[o.size];
      size = o.size;
      for (int i = 0; i < o.size; i++)
        data[i] = o.data[i];
    }
    ~IntegerArray() {
      delete[] data;
      cout << "call" << endl;
    }
};

template <class T>
T sum(const T a, const T b) {
  return a + b;
}

int main() {
  cout << sum(1, 2) << endl;
  cout << sum(1.21, 2.43) << endl;
  return 0;
}
