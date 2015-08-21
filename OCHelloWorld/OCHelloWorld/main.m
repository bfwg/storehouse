//
//  main.m
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-16.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Person.h"

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // insert code here...
        Person *person1 = [Person alloc];
        person1 = [person1 initWithName:@"Fan Jin" age:26 height:5.9];
        // together
        // Person *person1 = [[Person alloc] init];
        NSLog(@"Hello, World! %@", person1);
    }
    return 0;
}



