//
//  main.m
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-16.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Person.h"
#import "Teacher.h"
#import "Student.h"

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        
        Teacher *t = [[Teacher alloc] init];
        Student *s = [[Student alloc] init];
        Student *s2 = [[Student alloc] init];
        Student *s3 = [[Student alloc] init];
        s._name = @"Fan";
        s.position = CGPointMake(1, 1);
        s.teacher = t;
        s2._name = @"Sam";
        s2.position = CGPointMake(2, 2);
        s2.teacher = t;
        
            
        [s watchTeacherPositionChanged];
        [s2 watchTeacherPositionChanged];
        t.position = CGPointMake(0, 1);
        t.position = CGPointMake(1, 1);
        t.position = CGPointMake(2, 2);
        t.position = CGPointMake(0, 0);

        NSLog(@"%@", s.which);
        
        


     
        
        //[[NSNotificationCenter defaultCenter] postNotificationName:@"RING" object:nil];

    }
    return 0;
}



