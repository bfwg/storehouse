//
//  Student.h
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-23.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import "Person.h"
#import "Teacher.h"

@interface Student : Person

@property Teacher *teacher;

@property id which;


- (void)watchTeacherPositionChanged;

@end
