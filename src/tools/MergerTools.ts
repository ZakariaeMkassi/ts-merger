import { VariableStatement } from '../components/general/VariableStatement';
import { Decorator } from '../components/decorator/Decorator';
import { Constructor } from '../components/classDeclaration/members/constructor/Constructor';
import { PropertyDeclaration } from '../components/classDeclaration/members/property/PropertyDeclaration';
import { Method } from '../components/classDeclaration/members/method/Method';
import { ClassDeclaration } from '../components/classDeclaration/ClassDeclaration';
import { TSFile } from '../components/TSFile';
import * as ts from 'typescript';

export function mergeImports(baseFile: TSFile, patchFile: TSFile){
    let exists: boolean;
    patchFile.getImports().forEach(patchImportClause => {
        exists = false;
        baseFile.getImports().forEach(importClause => {
            if(importClause.getModule() === patchImportClause.getModule()){
                importClause.merge(patchImportClause);
                exists = true;
            }
        })
        if(!exists){
            baseFile.addImport(patchImportClause);
        }
    })
}

export function mergeClass(baseFile: TSFile, patchFile: TSFile, patchOverrides: boolean) {
    let baseClass: ClassDeclaration = baseFile.getClass();
    let patchClass: ClassDeclaration = patchFile.getClass();
    let exists: boolean;

    if(baseClass.getIdentifier() === patchClass.getIdentifier()){
        if(patchOverrides) {
            baseClass.setModifiers(patchClass.getModifiers())
            baseClass.setHeritages(patchClass.getHeritages());
        }

        mergeDecorators(baseClass.getDecorators(), patchClass.getDecorators(), patchOverrides);
        mergeProperties(baseClass.getProperties(), patchClass.getProperties(), patchOverrides);
        mergeConstructor(baseClass.getConstructor(), patchClass.getConstructor(), patchOverrides);
        mergeMethods(baseClass.getMethods(), patchClass.getMethods(), patchOverrides);
    }

}

export function mergeDecorators(baseDecorators: Decorator[], patchDecorators: Decorator[], patchOverrides: boolean) {
    let exists: boolean;

    patchDecorators.forEach(patchDecorator => {
        exists = false;
        baseDecorators.forEach(decorator => {
            if(patchDecorator.getIdentifier() === decorator.getIdentifier()){
                exists = true;
                decorator.merge(patchDecorator, patchOverrides);
            }
        })
        if(!exists) {
            baseDecorators.push(patchDecorator);
        }
    })
}

export function mergeProperties(baseProperties: PropertyDeclaration[], patchProperties: PropertyDeclaration[], patchOverrides: boolean) {
    let exists: boolean;

    patchProperties.forEach(patchProperty => {    
        exists = false;
        baseProperties.forEach(property => {
            if(patchProperty.getIdentifier() === property.getIdentifier()){
                exists = true;
                property.merge(patchProperty, patchOverrides);
            }
        })
        if(!exists) {
            baseProperties.push(patchProperty);
        }
    })
}

export function mergeConstructor(baseConstructor: Constructor, patchConstructor: Constructor, patchOverrides: boolean) {
    mergeMethod(baseConstructor, patchConstructor, patchOverrides);
}

export function mergeMethods(baseMethods: Method[], patchMethods: Method[], patchOverrides) {
    let exists: boolean;

    patchMethods.forEach(patchMethod => {
        exists = false;
        baseMethods.forEach(method => {
            if(patchMethod.getIdentifier() === method.getIdentifier()){
                exists = true;
                mergeMethod(method, patchMethod, patchOverrides);
            }
        })
        if(!exists) {
            baseMethods.push(patchMethod);
        }
    })
}

export function mergeMethod(baseMethod: Method, patchMethod: Method, patchOverrides: boolean) {
    baseMethod.merge(patchMethod, patchOverrides);
}

export function mergeVariables(baseFile: TSFile, patchFile: TSFile, patchOverrides: boolean) {
    let exists: boolean;
    patchFile.getVariables().forEach(patchVariable => {
        exists = false;
        baseFile.getVariables().forEach(variable => {
            if(patchVariable.getIdentifier() === variable.getIdentifier()) {
                exists = true;
                variable.merge(patchVariable, patchOverrides);
            }
        })
        if(!exists) {
            baseFile.addVariable(patchVariable);
        }
    })
}