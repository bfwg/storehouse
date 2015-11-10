#include <iostream>
using namespace std;

class Animal {
  protected:
  int age;
  char name[10];

  // public:
  // Shape(int w, int h) {
    // width = w;
    // height = h;
  // };
  public:
  void set_val(char name[], int age);
};

class Dolphin : public Animal{
  public:
  void get_val();
  // Rectangle(int w, int h) : Shape(w, h) {}
};

class Zebra : public Animal{
  public:
  // Triangle(int w, int h) : Shape(w, h) {}
};
